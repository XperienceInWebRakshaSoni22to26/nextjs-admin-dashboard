"use client";

import { memo } from "react";
import { Pagination, Stack } from "@mui/material";

type PaginationControlsProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

export const PaginationControls = memo(function PaginationControls({
  page,
  pageCount,
  onChange,
}: PaginationControlsProps) {
  return (
    <Stack sx={{ py: 1, alignItems: "center" }}>
      <Pagination
        page={page}
        count={pageCount}
        color="primary"
        onChange={(_, value) => onChange(value)}
      />
    </Stack>
  );
});
