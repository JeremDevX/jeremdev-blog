import Link from "next/link";

export default function TermsOfUse() {
  return (
    <main className="flex flex-col max-w-1000 mt-10 px-4 mb-12">
      <h1 className="text-center text-3xl font-bold mb-8">Terms of Use</h1>
      <ul>
        <li>
          <h2 className="text-2xl font-bold underline underline-offset-4 mb-2 mt-6 text-center">
            1. Introduction Welcome to my website
          </h2>
          By accessing or using this Website, you agree to comply with and be
          bound by the following terms and conditions. If you do not agree to
          these terms, please do not use this Website.
        </li>

        <li>
          <h2 className="text-2xl font-bold underline underline-offset-4 mb-2 mt-6 text-center">
            2. Intellectual Property & License
          </h2>
          All content available on this Website, including but not limited to
          text, images, tutorials, code, and other resources, is owned by{" "}
          <span className="font-bold text-primary">TechHowlerX</span> unless
          otherwise stated. <br />
          <br />
          You are free to:
          <ul className="list-disc pl-12">
            <li>
              Share: You can copy and redistribute the content in any medium or
              format.
            </li>
            <li>
              Adapt: You can remix, transform, and build upon the content for
              any purpose, even commercially.
            </li>
          </ul>
          <br />
          Under the following conditions:
          <ul className="list-disc pl-12">
            <li>
              Attribution: You must give appropriate credit, provide a link to
              the original content on this Website, and indicate if changes were
              made. You may do so in any reasonable manner, but not in any way
              that suggests the content creator endorses you or your use of the
              content.
            </li>
          </ul>
          <br />
          You can find more details about this license at Creative Commons
          Attribution 4.0 International (CC BY 4.0).
        </li>

        <li>
          <h2 className="text-2xl font-bold underline underline-offset-4 mb-2 mt-6 text-center">
            3. Restrictions
          </h2>
          You are not allowed to:
          <ul className="list-disc pl-12">
            <li>Use the content in any way that is unlawful or harmful.</li>
            <li>
              Misrepresent the original creator of the content or claim it as
              your own without proper attribution.
            </li>
            <li>
              Use the content to promote illegal activities or spread false
              information.
            </li>
          </ul>
        </li>

        <li>
          <h2 className="text-2xl font-bold underline underline-offset-4 mb-2 mt-6 text-center">
            4. Limitation of Liability
          </h2>
          <span className="font-bold text-primary">TechHowlerX</span> will not
          be held liable for any damages arising from the use or misuse of the
          content provided on this Website. All content is provided “as is,”
          without any guarantees or warranties.
        </li>

        <li>
          <h2 className="text-2xl font-bold underline underline-offset-4 mb-2 mt-6 text-center">
            5. External Links
          </h2>
          The Website may contain links to third-party websites. These external
          sites are not under our control, and we are not responsible for the
          content or privacy practices of these websites.
        </li>

        <li>
          <h2 className="text-2xl font-bold underline underline-offset-4 mb-2 mt-6 text-center">
            6. Modifications to the Terms
          </h2>
          We reserve the right to modify these terms at any time. Changes will
          be effective immediately upon posting to this page. Continued use of
          the Website after changes to the Terms of Use constitutes acceptance
          of those changes.
        </li>

        <li>
          <h2 className="text-2xl font-bold underline underline-offset-4 mb-2 mt-6 text-center">
            7. Contact
          </h2>
          If you have any questions or concerns about these terms, or if you
          wish to report any issues, please contact me at{" "}
          <Link
            href="mailto:jeremdev.contactpro@gmail.com"
            className="text-primary font-semibold"
          >
            jeremdev.contactpro@gmail.com
          </Link>{" "}
          or via{" "}
          <Link href="https://x.com" className="text-primary font-semibold">
            X(Twitter)
          </Link>
          .
        </li>
      </ul>
    </main>
  );
}
