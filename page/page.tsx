"use client";

import { TokenData } from "@/components/reward-pools/token-data";

export default function TopTokenPage() {
  return (
    <div className="max-w-[1280px] mx-auto">
      <h1 className="text-[48px] font-extrabold leading-[48px] tracking-[-0.012em] text-[#0F172A] text-center mt-[113px]">
        Reward Pools
      </h1>

      {/* Stats Cards */}
      <div className="w-[1212px] flex justify-between mt-[52px] mx-auto">
        <div className="flex flex-col justify-evenly w-[558px] h-[114px] p-3 py-0 bg-white border border-[#E5E7EB] rounded-[6px] shadow-[0px_4px_4px_rgba(174,174,174,0.25)]">
          <div className="text-[14px] leading-5 text-[#0F172A]">
            Total reward
          </div>
          <div className="text-[48px] font-extrabold leading-[36px] tracking-[-0.0075em] text-[#0F172A]">
            $ 230,202,221
          </div>
          <div className="mt-1 text-[10px] leading-[10px] text-[#0F172A]">
            <span className="font-mono">xxxx.xxxx</span> donates{" "}
            <span className="font-bold">23.5 TOKEN</span>{" "}
            <span>3 minutes ago</span>
          </div>
        </div>

        <div className="flex flex-col justify-evenly w-[288px] h-[114px] p-3 py-0 bg-white border border-[#E5E7EB] rounded-[6px] shadow-[0px_4px_4px_rgba(174,174,174,0.25)]">
          <div className="text-[14px] leading-5 text-[#0F172A]">
            Total claimed
          </div>
          <div className="text-[30px] font-extrabold leading-[36px] tracking-[-0.0075em] text-[#0F172A]">
            $ 30,202,221
          </div>
          <div className="mt-1 text-[10px] leading-[10px] text-[#0F172A]">
            <span className="font-mono">xxxx.xxxx</span> claimed{" "}
            <span className="font-bold">23.5 TOKEN</span>{" "}
            <span>3 minutes ago</span>
          </div>
        </div>

        <div className="flex flex-col justify-evenly w-[312px] h-[114px] p-3 py-0 bg-white border border-[#E5E7EB] rounded-[6px] shadow-[0px_4px_4px_rgba(174,174,174,0.25)]">
          <div className="text-[14px] leading-5 text-[#0F172A]">
            reward pools
          </div>
          <div className="text-[30px] font-extrabold leading-[36px] tracking-[-0.0075em] text-[#0F172A]">
            432
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#B3B3B3]" />
            <div className="text-[10px] leading-[10px] text-[#0F172A]">
              <span className="font-bold">TOKEN NAME</span> added{" "}
              <span>3 minutes ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[54px]">
        <TokenData />
      </div>
    </div>
  );
}
