export default function Footer() {
  return (
    <footer className="mt-20 border-t border-pink-100 bg-gradient-to-b from-white to-rose-50">
      <div className="mx-auto max-w-7xl px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-pink-500">
              Hunnyfloe
            </p>

            <h2
              className="text-4xl leading-tight text-gray-800"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 700 }}
            >
              Delivering Memories Through Flowers
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              With passion, experience, and a deep love for floral design,
              Hunnyfloe is here to be your trusted partner in every special
              moment.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Contact Us
            </h3>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="text-lg text-pink-500">📞</span>
                <span>08557826393</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-lg text-pink-500">✉️</span>
                <span>hunny.floe@gmail.com</span>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-lg text-pink-500">📷</span>
                <span>@hunnyfloe3</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Company Profile
            </h3>

            <p className="mb-4 text-sm leading-7 text-gray-600">
              Learn more about Hunnyfloe, our story, our values, and how we
              create meaningful floral arrangements for every occasion.
            </p>

            <a
              href="/Hunnyfloe Company Profile.pdf"
              download
              className="mt-2 inline-flex items-center gap-3 rounded-xl bg-pink-600/65 px-5 py-3 font-medium text-white transition hover:bg-pink-700"
            >
              <span>📄</span>
              <span>Check Our Company Profile</span>
            </a>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Closing Words
            </h3>

            <p className="text-sm leading-7 text-gray-600">
              We believe every flower tells a story, and we are dedicated to
              helping you express your emotions through beautiful, elegant, and
              meaningful arrangements.
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              Let Hunnyfloe be your first choice in bringing beauty and joy to
              life, one bloom at a time.
            </p>

            <p className="mt-4 text-sm font-medium text-pink-600">
              Thank you for your trust.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-pink-100 pt-6 text-center text-sm text-gray-500">
          © 2012 Hunnyfloe. Crafted with love, elegance, and meaningful blooms.
        </div>
      </div>
    </footer>
  )
}