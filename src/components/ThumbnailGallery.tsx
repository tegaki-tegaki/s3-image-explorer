import {
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TablePagination,
} from "@mui/material";
import { useState } from "react";

export const ThumbnailGallery = ({
  images,
  bucketURL,
}: {
  images: Array<string>;
  bucketURL: string;
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    window.scrollTo(0, 0);
  };

  console.log({ page });

  return (
    <div>
      <Grid2 container spacing={2}>
        {images
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((i) => {
            const imgURL = `${bucketURL}${i}`;
            const thumbnailURL =
              `${bucketURL}${i.split("/").join("/thumbnails/")}`.replace(
                /\.[^/.]+$/,
                ".jpg",
              );
            return (
              <Grid2 size={{ xs: 12, sm: 4, md: 3, lg: 2 }} key={imgURL}>
                <Paper>
                  <a href={imgURL} className="block w-full">
                    <img src={thumbnailURL} alt="" className="w-full" />
                  </a>
                </Paper>
              </Grid2>
            );
          })}
      </Grid2>
      <Stack sx={{ alignItems: "flex-end", marginX: 2, marginTop: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="go-to-page-label">Go to page</InputLabel>
          <Select
            id="go-to-page"
            label="Go to page"
            value={page.toString()}
            onChange={(event) => {
              console.log({ event });
              setPage(parseInt(event.target.value.toString() ?? "1"));
              window.scrollTo(0, 0);
            }}
          >
            {[...Array(Math.ceil(images.length / rowsPerPage)).keys()].map(
              (i) => {
                return (
                  <MenuItem key={i} value={i}>
                    {i + 1}
                  </MenuItem>
                );
              },
            )}
          </Select>
        </FormControl>
      </Stack>
      <TablePagination
        sx={{ marginX: 2 }}
        component="div"
        count={images.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="per page"
        size="medium"
      />
      <Stack sx={{ alignItems: "flex-end", marginX: 2, marginBottom: 4 }}>
        <Pagination
          count={Math.ceil(images.length / rowsPerPage)}
          page={page + 1}
          onChange={(event, value) => {
            setPage(value - 1);
            window.scrollTo(0, 0);
          }}
          variant="outlined"
          shape="rounded"
          size="large"
          color="primary"
        />
      </Stack>
    </div>
  );
};
