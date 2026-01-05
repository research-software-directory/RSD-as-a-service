// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export default function JumboBanner() {
  return (
    <div className="max-w-(--breakpoint-xl) mx-auto p-4  grid lg:grid-cols-[1fr_1fr] gap-8 md:gap-20 lg:my-20 md:px-10">
      {/* Jumbo Text*/}
      <div className="flex flex-col justify-center"
        data-aos="fade" data-aos-offset="200" data-aos-delay="50" data-aos-duration="1000"
      >
        <h1 className="text-4xl xl:text-5xl font-rsd-titles font-bold">
          Show your research software to the world
        </h1>
        <div className="mt-8 text-lg">
          The <span
            className="text-transparent font-medium bg-clip-text bg-linear-to-tr from-[#03A9F1] to-[#09FBD3] px-1">
            Research Software Directory
          </span>
          is designed to show the impact research software has on research and society. We stimulate
          the reuse of research software and encourage proper citation to ensure researchers and RSEs get credit for their work.
        </div>
      </div>

      {/* Video: it will only load once the page is rendered, and only when the user clicks on play. And it will strea the video after. */}
      <video width="100%" height="auto" className='rounded-lg' controls preload="metadata" poster="/video/rsd-video-cover.webp"
        data-aos="fade" data-aos-delay="100"
        data-aos-duration="600"
        data-aos-easing="ease-in-out">
        <source src="/video/RSD-video.mp4" type="video/mp4" />
        <source src="/video/RSD-video.webm" type="video/webm" />
        Your browser does not support HTML5 video.
      </video>
    </div>
  )
}
