"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const { data } = useSession();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    if (data?.user?.accessToken && data.user.username) {
      setAuth({ token: data.user.accessToken, username: data.user.username });
    }
  }, [data, setAuth]);

  return (
    <DashboardShell>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Welcome, {data?.user?.name ?? "Admin"}. Use the navigation to manage users and
          products.
        </Typography>
        <Grid container spacing={2}>
          {["Users", "Products", "Protected Routes"].map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{item}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item === "Users" && "List, search and paginate through users."}
                    {item === "Products" && "Browse product catalog with category filter."}
                    {item === "Protected Routes" && "Middleware blocks unauthenticated access."}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </DashboardShell>
  );
}
