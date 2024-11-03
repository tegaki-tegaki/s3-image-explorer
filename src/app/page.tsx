"use client";

import { ThumbnailGallery } from "@/components/ThumbnailGallery";
import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { XMLParser } from "fast-xml-parser";
import NextLink from "next/link";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export default function Home() {
  const [images, setImages] = useState<Array<string>>([]);
  const [bucketName, setBucketName] = useQueryState("bucket-name");
  const [bucketPrefix, setBucketPrefix] = useQueryState("prefix");
  const [bucketURL, setBucketURL] = useState(
    `https://${bucketName}.s3.amazonaws.com/`,
  );

  const setBucketData = ({
    name,
    prefix,
  }: {
    name: string;
    prefix: string;
  }) => {
    setBucketName(name);
    setBucketPrefix(prefix);
    setBucketURL(`https://${bucketName}.s3.amazonaws.com/`);
  };

  useEffect(() => {
    (async () => {
      let nextMarker: string | undefined = "";
      let isTruncated = false;

      const images = [];

      do {
        const marker = nextMarker ? `&marker=${nextMarker}` : "";
        const prefix = bucketPrefix ? `&prefix=${bucketPrefix}` : "";

        const listBucketXML = await (
          await fetch(`${bucketURL}?delimiter=/${prefix}${marker}`)
        ).text();

        const parser = new XMLParser();
        const listBucket = parser.parse(listBucketXML);
        const list = listBucket.ListBucketResult;

        nextMarker = list.NextMarker;
        isTruncated = list.IsTruncated;
        for (const content of list.Contents) {
          images.push(content.Key);
        }
        console.log(list);
      } while (isTruncated);

      setImages(images);
    })();
  }, [bucketURL, bucketPrefix]);

  return (
    <Stack gap={2}>
      <h1 className="text-3xl m-4">S3 Bucket Image Explorer</h1>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          Settings
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            This webapp only works for public s3 buckets, so you will not be
            needing any secrets for this to work.
          </Typography>
          <ul className="list-disc m-4">
            <li className="">
              <Typography variant="body1">
                Your bucket must have{" "}
                <Link
                  href="https://stackoverflow.com/questions/17533888/s3-access-control-allow-origin-header"
                  component={NextLink}
                >
                  a permissive CORS setup{" "}
                </Link>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                your bucket policy must allow <code>getObject</code>, for that
                you can use the{" "}
                <Link
                  href="http://awspolicygen.s3.amazonaws.com/policygen.html"
                  component={NextLink}
                >
                  Policy Builder
                </Link>
                .
              </Typography>
            </li>
          </ul>
          <Typography variant="body2" className="mb-8">
            The webapp also assumes that thumbnails for every image are inside a
            folder called <code>thumbnails/</code> directly inside the prefixed
            folder (the one you enter below), it also assumes that these
            thumbnails are all using the extension <code>.jpg</code>.
          </Typography>
          <form
            action={(form_data: FormData) => {
              console.log({ form_data });
              const bucketName = form_data.get("bucketName")?.toString() ?? "";
              const bucketPrefix =
                form_data.get("bucketPrefix")?.toString() ?? "";
              console.log({ bucketName, bucketPrefix });
              setBucketData({ name: bucketName, prefix: bucketPrefix });
            }}
          >
            <Stack gap={2} direction={{ xs: "column", sm: "row" }}>
              <TextField
                id="bucket-name"
                name="bucketName"
                label="bucket-name"
                variant="outlined"
                onChange={(e) => setBucketName(e.target.value)}
                value={bucketName || ""}
              />
              <TextField
                id="prefix"
                name="bucketPrefix"
                label="prefix"
                variant="outlined"
                onChange={(e) => setBucketPrefix(e.target.value)}
                value={bucketPrefix || ""}
              />
              <Button type="submit">Use</Button>
            </Stack>
          </form>
        </AccordionDetails>
      </Accordion>
      <ThumbnailGallery images={images} bucketURL={bucketURL} />
    </Stack>
  );
}
