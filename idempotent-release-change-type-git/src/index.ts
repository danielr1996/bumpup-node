import gitlog, { GitlogOptions } from "gitlog";

const options: GitlogOptions<"subject" | "authorName" | "authorDate"> = {
    repo: "foo",
    fields: ["subject", "authorName", "authorDate"],
};

gitlog(options);
