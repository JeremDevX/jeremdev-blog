import { getToolsByCategory } from "@/lib/tools";
import AsideToolsList from "./AsideToolsList";

interface AsideProps {
  asideFor: "tools" | "blog";
}

export default async function Aside(props: AsideProps) {
  const categories = getToolsByCategory();

  return (
    <aside className="aside">
      {props.asideFor === "tools" && (
        <div className="aside__container">
          {categories.map((cat) => (
            <AsideToolsList key={cat.name} category={cat.name} />
          ))}
        </div>
      )}
    </aside>
  );
}
