import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function Layout({ children }) {
  return (
    <section>
      <DefaultLayout>
        <div className="">{children}</div>
      </DefaultLayout>
    </section>
  );
}
