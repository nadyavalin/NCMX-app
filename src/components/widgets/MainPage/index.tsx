import Link from "next/link";

export const MainPage = () => {
  return (
    <>
      <main>
          <nav>
            <Link href="#">Несоответствия</Link>
            <Link href="#">Наблюдения</Link>
            <Link href="#">Возможности для улучшения</Link>
          </nav>
      </main>
    </>
  );
};
