"use client";
import { useEffect, useState } from "react";
import {
  combineTokenInfo,
  CombineTokenParams,
} from "@/services/combineTokensInfo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// 辅助函数：格式化数字
const formatNumber = (num: number): string => {
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    notation: "compact",
    compactDisplay: "short",
  }).format(num);
};

const DownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 inline-block"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const UpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 inline-block"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 15.75 7.5-7.5 7.5 7.5"
    />
  </svg>
);

export function TokenData() {
  const [selectedPeriod, setSelectedPeriod] = useState("24");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<CombineTokenParams[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "rewardPoolLiquidity",
    direction: "desc",
    clickCount: 1,
  });
  const timeframes = ["1", "4", "12", "24"];

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        const clickCount = (prev.clickCount % 3) + 1;
        if (clickCount === 3) {
          return {
            key: "rewardPoolLiquidity",
            direction: "desc",
            clickCount: 1,
          };
        }
        return {
          key,
          direction: clickCount === 1 ? "desc" : "asc",
          clickCount,
        };
      }
      return { key, direction: "desc", clickCount: 1 };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await combineTokenInfo();

        // 确保按照 pool 值从高到低排序
        const sortedResult = [...result].sort(
          (a, b) =>
            Number(a.rewardPoolLiquidity) - Number(b.rewardPoolLiquidity)
        );

        setData(sortedResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const getChangeInfo = (item: CombineTokenParams) => {
    return {
      change: item[`change${selectedPeriod}` as keyof CombineTokenParams],
      volume: item[`volume${selectedPeriod}` as keyof CombineTokenParams],
      donors: item[`donors${selectedPeriod}` as keyof CombineTokenParams],
      rewardPoolChange:
        item[`rewardPoolChange${selectedPeriod}` as keyof CombineTokenParams],
      Engagement:
        item[`Engagement${selectedPeriod}` as keyof CombineTokenParams],
    };
  };

  const filteredData = data
    .filter(
      (item) =>
        item.token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const direction = sortConfig.direction === "desc" ? -1 : 1;

      switch (sortConfig.key) {
        case "priceUSD":
          return direction * (Number(b.priceUSD) - Number(a.priceUSD));
        case "change":
          const changeA = Number(getChangeInfo(a).change);
          const changeB = Number(getChangeInfo(b).change);
          return direction * (changeB - changeA);
        case "marketCap":
          return direction * (b.marketCap - a.marketCap);
        case "volume":
          const volumeA = Number(getChangeInfo(a).volume);
          const volumeB = Number(getChangeInfo(b).volume);
          return direction * (volumeB - volumeA);
        case "rewardPoolLiquidity":
          return (
            direction *
            (Number(a.rewardPoolLiquidity) - Number(b.rewardPoolLiquidity))
          );
        case "rewardPoolChange":
          const poolChangeA = Number(getChangeInfo(a).rewardPoolChange);
          const poolChangeB = Number(getChangeInfo(b).rewardPoolChange);
          return direction * (poolChangeB - poolChangeA);
        case "donors":
          const donorsA = Number(getChangeInfo(a).donors);
          const donorsB = Number(getChangeInfo(b).donors);
          return direction * (donorsB - donorsA);
        case "userClaimed":
          return direction * (b.userClaimed - a.userClaimed);
        case "engagement":
          const engagementA = Number(getChangeInfo(a).Engagement);
          const engagementB = Number(getChangeInfo(b).Engagement);
          return direction * (engagementB - engagementA);
        case "rewardIndex":
          return direction * (b.rewardIndex - a.rewardIndex);
        default:
          // 确保默认情况下也是从高到低排序
          return Number(a.rewardPoolLiquidity) - Number(b.rewardPoolLiquidity);
      }
    });

  return (
    <div className="flex flex-col items-center">
      <div className="w-[1195px] flex justify-between items-center mb-4">
        <div className="relative w-[350px]">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search by name or xxx..."
            className="h-[36px] px-2 py-2 border-[#CBD5E1] text-[14px] leading-5 text-[#0F172A]/30 rounded-[6px]"
          />
        </div>
        <div className="flex gap-[7px]">
          {timeframes.map((timeframe) => (
            <Button
              key={timeframe}
              variant="outline"
              onClick={() => setSelectedPeriod(timeframe)}
              className={`${
                timeframe === "1" ? "w-12" : "w-[49px]"
              } h-10 text-[14px] leading-6 rounded-[6px] ${
                selectedPeriod === timeframe
                  ? "bg-[#0F172A] hover:bg-[#0F172A] text-white"
                  : "border-[#E2E8F0] text-[#0F172A] hover:bg-[#0F172A] hover:text-white"
              }`}
            >
              {timeframe}h
            </Button>
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px] text-center px-0">TOKEN</TableHead>
            <TableHead
              className="w-[100px] cursor-pointer text-center"
              onClick={() => handleSort("priceUSD")}
            >
              PRICE{" "}
              {sortConfig.key === "priceUSD" &&
                (sortConfig.direction === "desc" ? <DownIcon /> : <UpIcon />)}
            </TableHead>
            <TableHead
              className="w-[100px] cursor-pointer text-center px-0"
              onClick={() => handleSort("change")}
            >
              PRICE%{" "}
              {sortConfig.key === "change" &&
                (sortConfig.direction === "desc" ? <DownIcon /> : <UpIcon />)}
            </TableHead>
            <TableHead
              className="w-[120px] cursor-pointer text-center px-0"
              onClick={() => handleSort("marketCap")}
            >
              MKT CAP{" "}
              {sortConfig.key === "marketCap" &&
                (sortConfig.direction === "desc" ? <DownIcon /> : <UpIcon />)}
            </TableHead>
            <TableHead
              className="w-[100px] cursor-pointer text-center px-0"
              onClick={() => handleSort("volume")}
            >
              VOL{" "}
              {sortConfig.key === "volume" &&
                (sortConfig.direction === "desc" ? <DownIcon /> : <UpIcon />)}
            </TableHead>
            <TableHead
              className="w-[120px] cursor-pointer text-center px-0"
              onClick={() => handleSort("rewardPoolLiquidity")}
            >
              POOL{" "}
              {sortConfig.key === "rewardPoolLiquidity" &&
                sortConfig.clickCount !== 1 &&
                (sortConfig.direction === "desc" ? <DownIcon /> : <UpIcon />)}
            </TableHead>
            <TableHead
              className="w-[120px] cursor-pointer text-center px-0"
              onClick={() => handleSort("rewardPoolChange")}
            >
              POOL%{" "}
              {sortConfig.key === "rewardPoolChange" &&
                (sortConfig.direction === "desc" ? <DownIcon /> : <UpIcon />)}
            </TableHead>
            <TableHead
              className="w-[120px] cursor-pointer text-center px-0"
              onClick={() => handleSort("donors")}
            >
              DONATORS{" "}
              {sortConfig.key === "donors" &&
                (sortConfig.direction === "desc" ? <DownIcon /> : <UpIcon />)}
            </TableHead>
            <TableHead
              className="w-[100px] cursor-pointer text-center px-0"
              onClick={() => handleSort("userClaimed")}
            >
              CLAIMED{" "}
              {sortConfig.key === "userClaimed" &&
                (sortConfig.direction === "desc" ? <DownIcon /> : <UpIcon />)}
            </TableHead>
            <TableHead
              className="w-[130px] cursor-pointer text-center px-0"
              onClick={() => handleSort("engagement")}
            >
              ENGAGEMENT{" "}
              {sortConfig.key === "engagement" &&
                (sortConfig.direction === "desc" ? <DownIcon /> : <UpIcon />)}
            </TableHead>
            <TableHead
              className="w-[120px] cursor-pointer text-center px-0"
              onClick={() => handleSort("rewardIndex")}
            >
              INDEX{" "}
              {sortConfig.key === "rewardIndex" &&
                (sortConfig.direction === "desc" ? <DownIcon /> : <UpIcon />)}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((res, val) => {
            const { change, volume, donors, Engagement, rewardPoolChange } =
              getChangeInfo(res);
            return (
              <TableRow key={val} className="hover:bg-muted/50">
                <TableCell className="w-[200px]">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-[5px]">
                      <AvatarImage
                        src={res.logoURI}
                        className="object-cover"
                        alt={res.token.name}
                      />
                      <AvatarFallback className="bg-[#B3B3B3] rounded-[5px]">
                        {res.token.symbol.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{res.token.name}</span>
                      </div>
                      <span className="text-sm text-[#0F172A] opacity-40">
                        ${res.token.symbol}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="w-[100px] text-center">
                  {Number(res.priceUSD) < 0.0001
                    ? "<$0.0001"
                    : `$${Number(res.priceUSD).toFixed(4)}`}
                </TableCell>
                <TableCell className="w-[100px] text-center">
                  <span
                    className={cn(
                      Number(change) >= 0 ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {Number(change) >= 0 ? "+" : ""}
                    {(Number(change) * 100).toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell className="w-[100px] text-center">
                  ${formatNumber(res.marketCap)}
                </TableCell>
                <TableCell className="w-[100px] text-center">
                  ${formatNumber(Number(volume))}
                </TableCell>
                <TableCell className="w-[120px] text-center">
                  ${formatNumber(res.rewardPoolLiquidity)}
                </TableCell>
                <TableCell className="w-[120px] text-center">
                  <span className="text-green-500">
                    +{(Number(rewardPoolChange) * 100).toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell className="w-[100px] text-center">
                  <span className="text-green-500">
                    +{formatNumber(Number(donors))}
                  </span>
                </TableCell>
                <TableCell className="w-[100px] text-center">
                  ${formatNumber(res.userClaimed)}
                </TableCell>
                <TableCell className="w-[120px] text-center">
                  {formatNumber(Number(Engagement))}
                </TableCell>
                <TableCell className="w-[120px] text-center">
                  {res.rewardIndex.toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
