import "@testing-library/jest-dom/extend-expect";
import { render, screen, act, waitFor } from "@testing-library/react";
import type { IQueryOptions } from "./useQuery";
import { useQuery } from "./useQuery";

describe("<useQuery /> hook", () => {
    const mockFetch = jest.fn();

    interface ITestComponentProps {
        options?: IQueryOptions
    }

    const TestComponent = (props: ITestComponentProps) => {
        const [state, fetch] = useQuery(mockFetch, props.options);

        return <div>
            <div data-testid="loading">{state.isLoading ? "Loading..." : "false"}</div>
            <div data-testid="data">{state.data}</div>
            <div data-testid="errors">{state.errors && state.errors.message}</div>
            <button onClick={fetch}>Fetch</button>
        </div>;
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("internal state ::isLoading need to be true if ::fetch is NOT resolved yet", async () => {
        render(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByTestId("loading")).toHaveTextContent("Loading...");
        });
    });

    it("internal state ::isLoading need to be false if ::fetch is resolved successfully", async () => {
        mockFetch.mockResolvedValue("testData");

        await act(async () => {
            render(<TestComponent />);
        });

        expect(screen.getByTestId("loading")).toHaveTextContent("false");
        expect(screen.getByTestId("data")).toHaveTextContent("testData");
        expect(screen.getByTestId("errors")).toHaveTextContent("");
    });

    it("internal state ::isLoading need to be false if ::fetch is resolved with error", async () => {
        const errorMessage = "Fetch error";
        mockFetch.mockRejectedValue(new Error(errorMessage));

        await act(async () => {
            render(<TestComponent />);
        });

        expect(screen.getByTestId("loading")).toHaveTextContent("false");
        expect(screen.getByTestId("data")).toHaveTextContent("");
        expect(screen.getByTestId("errors")).toHaveTextContent(errorMessage);
    });

    it("manual fetching mode", async () => {
        mockFetch.mockResolvedValue("testData");

        await act(async () => {
            render(<TestComponent options={{ manual: true }} />);
        });

        expect(screen.getByTestId("loading")).toHaveTextContent("false");

        await act(async () => {
            screen.getByText("Fetch").click();
        });

        expect(screen.getByTestId("loading")).toHaveTextContent("false");
        expect(screen.getByTestId("data")).toHaveTextContent("testData");
        expect(screen.getByTestId("errors")).toHaveTextContent("");
    });
});
