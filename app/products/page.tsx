"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Alert,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useProductsStore } from "@/store/productsStore";
import { PaginationControls } from "@/components/shared/PaginationControls";

const LIMIT = 10;

export default function ProductsPage() {
  const { products, categories, total, loading, error, fetchProducts, fetchCategories } =
    useProductsStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const skip = useMemo(() => (page - 1) * LIMIT, [page]);
  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / LIMIT)), [total]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts({
      limit: LIMIT,
      skip,
      q: search.trim() || undefined,
      category: category === "all" ? undefined : category,
    });
  }, [category, fetchProducts, search, skip]);

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearch(event.target.value);
  }, []);

  return (
    <DashboardShell>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Products
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Search products"
            value={search}
            onChange={handleSearch}
            fullWidth
          />
          <FormControl sx={{ minWidth: { xs: "100%", md: 260 } }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => {
                setPage(1);
                setCategory(e.target.value);
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {categories.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <Card>
                  <CardMedia sx={{ position: "relative", height: 200 }}>
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </CardMedia>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component={Link}
                      href={`/products/${product.id}`}
                      sx={{ display: "inline-block", mb: 1 }}
                    >
                      {product.title}
                    </Typography>
                    <Typography color="text.secondary">Category: {product.category}</Typography>
                    <Typography color="text.secondary">Price: ${product.price}</Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Rating value={product.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2">{product.rating}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <PaginationControls page={page} pageCount={pageCount} onChange={setPage} />
      </Stack>
    </DashboardShell>
  );
}
