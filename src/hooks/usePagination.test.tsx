import "@testing-library/jest-dom/extend-expect";
import { render, screen, act } from "@testing-library/react";
import { usePagination } from "./usePagination";

describe("<usePagination /> hook", () => {
    const TestComponent = () => {
        const { currentPage, setCurrentPage, nextPage, prevPage } = usePagination();

        return (
            <div>
                <div data-testid="page">{currentPage}</div>
                <button data-testid="custom" onClick={() => setCurrentPage(10)}>Custom</button>
                <button data-testid="prev" onClick={prevPage}>Prev</button>
                <button data-testid="next" onClick={nextPage}>Next</button>
            </div>
        );
    };

    it("should be initiated with ::currentPage 1", async () => {
        render(<TestComponent />);

        expect(screen.getByTestId("page")).toHaveTextContent("1");
    });

    it("::setCurrentPage hook, should set ::currentPage to argument provided (10)", async () => {
        render(<TestComponent />);

        await act(async () => {
            screen.getByTestId("custom").click();
        });

        expect(screen.getByTestId("page")).toHaveTextContent("10");
    });

    it("::prevPage hook, should reduce ::currentPage by one", async () => {
        render(<TestComponent />);

        await act(async () => {
            screen.getByTestId("prev").click();
        });

        expect(screen.getByTestId("page")).toHaveTextContent("0");
    });

    it("::nextPage hook, should increase ::currentPage by one", async () => {
        render(<TestComponent />);

        await act(async () => {
            screen.getByTestId("next").click();
        });

        expect(screen.getByTestId("page")).toHaveTextContent("2");
    });
});
