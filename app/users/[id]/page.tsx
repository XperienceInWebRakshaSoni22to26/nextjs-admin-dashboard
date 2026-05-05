"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Alert,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useUsersStore } from "@/store/usersStore";

export default function UserDetailsPage() {
  const params = useParams<{ id: string }>();
  const { selectedUser, loading, error, fetchUserById } = useUsersStore();

  useEffect(() => {
    if (params.id) {
      fetchUserById(params.id);
    }
  }, [fetchUserById, params.id]);

  return (
    <DashboardShell>
      <Stack spacing={2}>
        <Typography component={Link} href="/users" color="primary">
          Back to Users
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {loading || !selectedUser ? (
          <CircularProgress />
        ) : (
          <Card>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ alignItems: "center" }}
              >
                <Avatar src={selectedUser.image} sx={{ width: 72, height: 72 }} />
                <Stack>
                  <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Typography>
                  <Typography color="text.secondary">{selectedUser.email}</Typography>
                </Stack>
              </Stack>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography>
                    <strong>Username:</strong> {selectedUser.username}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography>
                    <strong>Phone:</strong> {selectedUser.phone}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography>
                    <strong>Gender:</strong> {selectedUser.gender}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography>
                    <strong>Company:</strong> {selectedUser.company?.name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography>
                    <strong>Address:</strong> {selectedUser.address?.address},{" "}
                    {selectedUser.address?.city}, {selectedUser.address?.state}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Stack>
    </DashboardShell>
  );
}
