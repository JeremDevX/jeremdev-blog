import path from "path";
import fs from "fs";

export interface ToolsCategory {
  name: string;
  tools: { name: string; url: string }[];
}

function ToolList({ category }: { category: ToolsCategory }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">{category.name}</h2>
      <ul className="list-disc ml-6 mt-2">
        {category.tools.length > 0 ? (
          category.tools.map((tool) => (
            <li key={tool.name}>
              <a
                href={tool.url}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {tool.name}
              </a>
            </li>
          ))
        ) : (
          <p className="text-gray-500">
            Aucun outil disponible dans cette catégorie.
          </p>
        )}
      </ul>
    </div>
  );
}

export default function Tools() {
  const toolsFilePath = path.join(
    process.cwd(),
    "public",
    "data",
    "tools-list.json"
  );
  const toolsData = fs.readFileSync(toolsFilePath, "utf8");
  const fetchedToolsCategories: ToolsCategory[] =
    JSON.parse(toolsData).categories;

  return (
    <>
      <h1 className="text-3xl font-bold mt-4">Dev tools</h1>
      <section className="mb-8">
        {fetchedToolsCategories.map((category) => (
          <ToolList key={category.name} category={category} />
        ))}
      </section>
    </>
  );
}
