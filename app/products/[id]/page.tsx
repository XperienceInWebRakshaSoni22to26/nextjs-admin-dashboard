"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useProductsStore } from "@/store/productsStore";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const { selectedProduct, loading, error, fetchProductById } = useProductsStore();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProductById(params.id);
    }
  }, [fetchProductById, params.id]);

  const currentImage = useMemo(
    () =>
      selectedProduct?.images?.[
        activeImage < (selectedProduct.images?.length ?? 0) ? activeImage : 0
      ] ?? selectedProduct?.thumbnail ?? "",
    [activeImage, selectedProduct]
  );

  return (
    <DashboardShell>
      <Stack spacing={2}>
        <Typography component={Link} href="/products" color="primary">
          Back to Products
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {loading || !selectedProduct ? (
          <CircularProgress />
        ) : (
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ position: "relative", width: "100%", height: 320 }}>
                    <Image
                      src={currentImage}
                      alt={selectedProduct.title}
                      fill
                      style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                    {selectedProduct.images.map((img, index) => (
                      <Button
                        key={img}
                        size="small"
                        variant={activeImage === index ? "contained" : "outlined"}
                        onClick={() => setActiveImage(index)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={1}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                      {selectedProduct.title}
                    </Typography>
                    <Typography color="text.secondary">{selectedProduct.description}</Typography>
                    <Typography>
                      <strong>Category:</strong> {selectedProduct.category}
                    </Typography>
                    <Typography>
                      <strong>Price:</strong> ${selectedProduct.price}
                    </Typography>
                    <Typography>
                      <strong>Brand:</strong> {selectedProduct.brand}
                    </Typography>
                    <Typography>
                      <strong>Stock:</strong> {selectedProduct.stock}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Rating value={selectedProduct.rating} precision={0.1} readOnly />
                      <Typography>{selectedProduct.rating}</Typography>
                    </Stack>
                    <Typography>
                      <strong>Warranty:</strong>{" "}
                      {selectedProduct.warrantyInformation ?? "No information"}
                    </Typography>
                    <Typography>
                      <strong>Shipping:</strong>{" "}
                      {selectedProduct.shippingInformation ?? "No information"}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Stack>
    </DashboardShell>
  );
}
