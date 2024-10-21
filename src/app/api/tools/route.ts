import path from "path";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const toolsFilePath = path.join(
      process.cwd(),
      "public",
      "data",
      "tools-list.json"
    );
    const toolsData = await fs.readFile(toolsFilePath, "utf8");

    // Vérification du contenu du fichier JSON
    if (!toolsData) {
      return NextResponse.json(
        { error: "Le fichier tools-list.json est vide." },
        { status: 500 }
      );
    }

    const fetchedToolsCategories = JSON.parse(toolsData).categories;
    return NextResponse.json(fetchedToolsCategories, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier JSON :", error);
    return NextResponse.json(
      { error: "Erreur lors de la lecture du fichier JSON." },
      { status: 500 }
    );
  }
}
