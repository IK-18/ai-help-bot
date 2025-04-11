import {NextRequest} from "next/server";
import path from "path";
import archiver from "archiver";
import {PassThrough} from "stream";

export async function GET(request: NextRequest) {
	const archive = archiver("zip", {zlib: {level: 9}});
	const stream = new PassThrough();

	const widgetPath = path.resolve("packages/chatbot-widget");

	// What to include in the zip
	archive.directory(path.join(widgetPath, "src"), "src");
	archive.file(path.join(widgetPath, "README.md"), {name: "README.md"});

	archive.pipe(stream);
	archive.finalize();

	return new Response(stream as any, {
		status: 200,
		headers: {
			"Content-Type": "application/zip",
			"Content-Disposition": `attachment; filename="chatbot-widget.zip"`,
		},
	});
}
