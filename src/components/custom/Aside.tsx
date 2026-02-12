import path from "path";
import fs from "fs";
import AsideToolsList from "./AsideToolsList";
import { ToolsCategory } from "@/app/tools/page";

interface AsideProps {
  asideFor: "tools" | "blog";
}

export default async function Aside(props: AsideProps) {
  const toolsFilePath = path.join(
    process.cwd(),
    "public",
    "data",
    "tools-list.json"
  );
  const toolsData = fs.readFileSync(toolsFilePath, "utf8");
  const fetchedToolsCategories = JSON.parse(toolsData).categories;

  return (
    <aside className="aside">
      {props.asideFor === "tools" && (
        <div className="aside__container">
          {fetchedToolsCategories.map((toolName: ToolsCategory) => (
            <AsideToolsList key={toolName.name} category={toolName.name} />
          ))}
        </div>
      )}
    </aside>
  );
}
