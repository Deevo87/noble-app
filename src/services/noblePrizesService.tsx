import React, { createContext, useContext, useState, useEffect } from "react";

const API_URL = "https://api.nobelprize.org/2.1/nobelPrizes";

export interface PrizeData {
  awardYear: string;
  category: {
    en: string;
    no: string;
    se: string;
  };
  categoryFullName: {
    en: string;
    no: string;
    se: string;
  };
  dateAwarded: string;
  prizeAmount: number;
  prizeAmountAdjusted: number;
  links: any[];
  laureates: any[];
}

interface DisplayPrizeData {
  awardYear: string;
  category: string;
  dateAwarded: string;
  prizeAmount: number;
}

function createData(
  awardYear: string,
  category: string,
  dateAwarded: string,
  prizeAmount: number
) {
  return { awardYear, category, dateAwarded, prizeAmount };
}

interface NobelPrizeServiceResult {
  loading: boolean;
  getUniqueYears: () => string[];
  getRowData: (year, language) => DisplayPrizeData[];
  getAllPrizesFromYear: (year) => PrizeData[];
}

const NobelPrizeContext = createContext<NobelPrizeServiceResult | undefined>(
  undefined
);

export const NobelPrizeProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<PrizeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(
          `HTTP error, couldn't fetch data. Status: ${response.status}`
        );
      }
      const apiData = await response.json();
      console.log("apidata");
      console.log(apiData);
      setData(apiData.nobelPrizes);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setData([]);
    }
  };

  useEffect(() => {
    const fetchDataAndSetYears = async () => {
      await fetchData();
    };
    fetchDataAndSetYears();
  }, [loading]);

  const getUniqueYears = () => {
    if (data) {
      const years = Array.from(new Set(data.map((prize) => prize.awardYear)));
      return years;
    } else {
      throw new Error(`Data is empty, data: ${data}`);
    }
    // return uniqueYears;
  };

  const getAllPrizesFromYear = (year) => {
    if (data) {
      const prizes = data.filter((prize) => prize.awardYear === year);
      prizes.forEach((prize) => {
        if (prize.dateAwarded === undefined) {
          prize.dateAwarded = "-";
        }
      });
      return prizes;
    } else {
      throw new Error(
        `Data is empty in getAllPrizesFromYear function. Data:${data}`
      );
    }
  };

  const getRowData = (year, language) => {
    const prizes = getAllPrizesFromYear(year);
    const mappedPrizes: DisplayPrizeData[] = prizes.map((prize) =>
      createData(
        prize.awardYear,
        prize.category[language],
        formatDate(prize.dateAwarded),
        formatPrizeAmount(prize.prizeAmount)
      )
    );
    return mappedPrizes;
  };

  const formatDate = (inputDate) => {
    if (inputDate === "-") {
      return inputDate;
    }
    const [year, month, day] = inputDate.split("-");
    return `${day}-${month}-${year}`;
  };

  const formatPrizeAmount = (date: number) => {
    const formatedDate = date.toLocaleString("fr");
    return formatedDate;
  };

  return (
    <NobelPrizeContext.Provider
      value={{ getUniqueYears, loading, getAllPrizesFromYear, getRowData }}
    >
      {children}
    </NobelPrizeContext.Provider>
  );
};

export const useNobelPrize = () => {
  const context = useContext(NobelPrizeContext);
  if (!context) {
    throw new Error("useNobelPrize must be used within a NobelPrizeProvider");
  }
  return context;
};
