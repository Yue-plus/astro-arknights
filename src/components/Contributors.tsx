import { useCallback, useEffect, useState } from "react";
import fallbackContributors from "../data/contributors.json";

const REPOSITORY = "Yue-plus/astro-arknights";
const REPOSITORY_OWNER = "Yue-plus";
const CONTRIBUTORS_API = `https://api.github.com/repos/${REPOSITORY}/contributors?per_page=100`;
const REPOSITORY_URL = `https://github.com/${REPOSITORY}`;

type GitHubContributor = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
};

const FALLBACK_CONTRIBUTORS: GitHubContributor[] = fallbackContributors;

export default function Contributors() {
  const [contributors, setContributors] = useState<GitHubContributor[]>(
    FALLBACK_CONTRIBUTORS,
  );
  const [updateFailed, setUpdateFailed] = useState(false);

  const loadContributors = useCallback(async () => {
    setUpdateFailed(false);

    try {
      const response = await fetch(CONTRIBUTORS_API, {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      if (!response.ok) {
        throw new Error(
          response.status === 403
            ? "GitHub API 请求次数已达上限，请稍后重试。"
            : `GitHub API 请求失败（${response.status}）。`,
        );
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("GitHub 返回了无法识别的数据。");
      }

      const validContributors = data.filter(
        (item): item is GitHubContributor =>
          typeof item === "object" &&
          item !== null &&
          "id" in item &&
          "login" in item &&
          "avatar_url" in item &&
          "html_url" in item &&
          "contributions" in item,
      );

      if (validContributors.length === 0) {
        throw new Error("GitHub 暂未返回贡献者数据。");
      }

      setContributors(validContributors);
    } catch (requestError) {
      console.warn("GitHub contributors update failed:", requestError);
      setUpdateFailed(true);
    }
  }, []);

  useEffect(() => {
    void loadContributors();
  }, [loadContributors]);

  const totalContributions = contributors.reduce(
    (total, contributor) => total + contributor.contributions,
    0,
  );

  return (
    <section className="min-h-full max-w-[80rem] pb-20 pr-4 pt-12 portrait:pr-6 portrait:pt-7">
      <header className="mb-10 border-l-4 border-ark-blue pl-5">
        <p className="font-benderBold text-xs tracking-[0.35em] text-ark-blue">
          DEVELOPERS & CONTRIBUTORS
        </p>
        <h1 className="mt-2 text-4xl font-black text-white portrait:text-3xl">
          项目贡献者
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
          感谢每一位为项目提交代码、修复问题和完善内容的开发者。
        </p>
        {updateFailed && (
          <p className="mt-2 text-xs text-end-yellow/80">
            GitHub 数据更新失败
          </p>
        )}
      </header>

      <div className="mb-8 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
        <div className="bg-[#111] px-5 py-4">
          <div className="font-oswaldMedium text-3xl text-white">
            {contributors.length}
          </div>
          <div className="text-[10px] tracking-[0.25em] text-white/40">
            CONTRIBUTORS
          </div>
        </div>
        <div className="bg-[#111] px-5 py-4">
          <div className="font-oswaldMedium text-3xl text-white">
            {totalContributions}
          </div>
          <div className="text-[10px] tracking-[0.25em] text-white/40">
            CONTRIBUTIONS
          </div>
        </div>
        <a
          href={REPOSITORY_URL}
          className="col-span-2 flex items-center justify-between bg-ark-blue px-5 py-4 text-black transition-colors hover:bg-white sm:col-span-1"
        >
          <span>
            <strong className="block text-sm">查看仓库</strong>
            <span className="text-[10px] tracking-[0.2em]">OPEN GITHUB</span>
          </span>
          <span className="text-xl" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {contributors.map((contributor, index) => (
          <a
            key={contributor.id}
            href={contributor.html_url}
            className="group relative overflow-hidden border border-white/10 bg-black/35 p-5 text-white transition duration-300 hover:-translate-y-1 hover:border-ark-blue hover:bg-black/70"
          >
            <span className="absolute right-4 top-3 font-oswaldMedium text-5xl text-white/[0.04] transition-colors group-hover:text-ark-blue/10">
              {String(index + 1).padStart(2, "0")}
            </span>
            <img
              src={contributor.avatar_url}
              alt={`${contributor.login} 的 GitHub 头像`}
              width="72"
              height="72"
              loading="lazy"
              className="h-[4.5rem] w-[4.5rem] rounded-full border-2 border-white/15 bg-black object-cover transition-colors group-hover:border-ark-blue"
            />
            <div className="mt-5 min-w-0">
              <h2 className="truncate font-benderBold text-xl">
                {contributor.login}
              </h2>
              <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[10px] tracking-[0.2em] text-white/35">
                  {contributor.login.toLowerCase() ===
                  REPOSITORY_OWNER.toLowerCase()
                    ? "OWNER"
                    : "CONTRIBUTOR"}
                </span>
                <span className="text-xs font-bold text-ark-blue">
                  {contributor.contributions} 次贡献
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
