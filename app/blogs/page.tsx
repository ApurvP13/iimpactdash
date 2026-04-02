import { getBlogs } from "@/actions/blog-actions";
import { BlogDataRow } from "@/components/blog-data-row";

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <main className="p-8 flex flex-col gap-4 w-screen  items-center ">
      <h1 className="text-2xl font-bold font-mono text-center">Live Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-muted-foreground font-mono">
          No blogs found. Create one using the sidebar.
        </p>
      ) : (
        <div className="rounded-lg overflow-hidden border border-border">
          {blogs.map((blog, i) => (
            <BlogDataRow
              key={blog.id}
              index={i + 1}
              id={blog.id}
              title={blog.title}
              blurb={blog.blurb}
              slug={blog.slug}
              createdAt={blog.created_at}
            />
          ))}
        </div>
      )}
    </main>
  );
}
