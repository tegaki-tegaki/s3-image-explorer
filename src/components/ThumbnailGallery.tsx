import { Grid2, Paper, TablePagination } from "@mui/material";
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
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      <TablePagination
        component="div"
        count={images.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="per page"
      />
    </div>
  );
};
