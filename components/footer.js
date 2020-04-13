const FOOTER_LINKS = [
  {
    href: "",
    label: "White paper",
  },
  {
    href: "",
    label: "Documentation",
  },
  {
    href: "",
    label: "Terms of Service",
  },
  {
    href: "",
    label: "Blog",
  },
  {
    href: "",
    label: "Forum",
  },
  {
    href: "",
    label: "FAQ",
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-border-pure py-6 mt-8">
      <div className="container">
        <div className="flex">
          <div className="w-3/4">
            <ul className="flex flex-wrap text-type-lightest text-sm -mr-4 -mb-2 flex-wrap">
              {FOOTER_LINKS.map(({ href, label }, i) => (
                <li key={i} className="pb-2 pr-4">
                  <a className="hover:underline" href={href}>
                    {label}
                  </a>
                </li>
              ))}
              <li className="pb-2 pr-4">© 2020 Union.Finance</li>
            </ul>
          </div>
          <ul className="flex w-1/4 justify-end">
            <li className="ml-4">
              <div className="h-6 w-6 rounded-full bg-type-lightest"></div>
            </li>
            <li className="ml-4">
              <div className="h-6 w-6 rounded-full bg-type-lightest"></div>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
