"use client";
import { FaGithub } from "react-icons/fa";

const callTo = "+972546653443";

const Footer = () => {
  return (
    <footer className="w-full border-t bottom-0 sticky bg-primary-foreground z-20">
      <div className="container mx-auto px-4 flex flex-row justify-around items-center">
        <div className="flex h-16 items-center justify-between flex-row gap-2">
          <p className="text-sm font-medium flex flex-row items-center gap-1">
            Build with ❤️ by{" "}
            <a
              className="font-bold"
              href="
            https://www.linkedin.com/in/omer-levy-9b2aa21b9/"
            >
              Tuval simha
            </a>
          </p>
          <a
            href="https://github.com/TuvalSimha/infinya-home-task-tuval-simha"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub width={36} height={36} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
