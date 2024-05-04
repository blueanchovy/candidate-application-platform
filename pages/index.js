import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [apiData, setApiData] = useState();
  const BASE_URL = "https://api.weekday.technology/adhoc/getSampleJdJSON";
  console.log(apiData);

  useEffect(() => {
    async function getJobsData() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const body = JSON.stringify({
        limit: 10,
        offset: 0,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body,
      };

      await fetch(BASE_URL, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          setApiData(result);
        })
        .catch((error) => console.error(error));
    }

    getJobsData();
  }, []);

  return (
    <>
      <Head>
        <title>Candidate Application Platform</title>
        <meta name="description" content="Weekday - Assignment" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>Hello Friend!</main>
    </>
  );
}
