"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useUsersStore } from "@/store/usersStore";
import { PaginationControls } from "@/components/shared/PaginationControls";

const LIMIT = 10;

export default function UsersPage() {
  const { users, total, loading, error, fetchUsers } = useUsersStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const skip = useMemo(() => (page - 1) * LIMIT, [page]);
  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / LIMIT)), [total]);

  useEffect(() => {
    fetchUsers({ limit: LIMIT, skip, q: search.trim() || undefined });
  }, [fetchUsers, search, skip]);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearch(event.target.value);
  }, []);

  return (
    <DashboardShell>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Users
        </Typography>
        <TextField
          label="Search users"
          placeholder="Search by name or email"
          value={search}
          onChange={handleSearch}
          fullWidth
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress size={26} />
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Link href={`/users/${user.id}`}>{`${user.firstName} ${user.lastName}`}</Link>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>{user.gender}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.company?.name ?? "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <PaginationControls page={page} pageCount={pageCount} onChange={setPage} />
      </Stack>
    </DashboardShell>
  );
}
