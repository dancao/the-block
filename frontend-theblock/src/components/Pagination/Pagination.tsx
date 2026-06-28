import { useState } from "react";

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    pageSizeOptions?: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

export default function Pagination({
    currentPage,
    totalItems,
    pageSize,
    pageSizeOptions = [10, 20, 50],
    onPageChange,
    onPageSizeChange
}: PaginationProps) {

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const [pageInput, setPageInput] = useState(currentPage.toString());

    const goToPage = () => {

        let page = Number(pageInput);

        if (isNaN(page))
            return;

        page = Math.max(1, Math.min(page, totalPages));

        onPageChange(page);
    };

    const startItem =
        totalItems === 0
            ? 0
            : (currentPage - 1) * pageSize + 1;

    const endItem =
        Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="mt-8 flex flex-col gap-4 rounded-lg border bg-white p-4 shadow md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-600">
                Showing <b>{startItem}</b> - <b>{endItem}</b> of <b>{totalItems}</b>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="rounded border px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                >
                    First
                </button>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded border px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                >
                    Prev
                </button>

                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded border px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                >
                    Next
                </button>

                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="rounded border px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                >
                    Last
                </button>

                <span className="ml-4">
                    Go to
                </span>

                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onBlur={goToPage}
                    onKeyDown={(e) => {
                        if (e.key === "Enter")
                            goToPage();
                    }}
                    className="w-20 rounded border px-2 py-2"
                />

                <span>
                    Page Size
                </span>

                <select
                    value={pageSize}
                    onChange={(e) =>
                        onPageSizeChange(Number(e.target.value))
                    }
                    className="rounded border px-2 py-2"
                >
                    {pageSizeOptions.map(size => (
                        <option
                            key={size}
                            value={size}
                        >
                            {size}
                        </option>
                    ))}
                </select>

            </div>

        </div>
    );
}