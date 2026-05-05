"use client";

import { PropsWithChildren, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuthStore } from "@/store/authStore";

export function DashboardShell({ children }: PropsWithChildren) {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = useCallback(async () => {
    clearAuth();
    await signOut({ redirect: false });
    router.push("/login");
  }, [clearAuth, router]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "grey.100" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component={Link} href="/dashboard">
              Home
            </Button>
            <Button color="inherit" component={Link} href="/users">
              Users
            </Button>
            <Button color="inherit" component={Link} href="/products">
              Products
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>{children}</Container>
    </Box>
  );
}
