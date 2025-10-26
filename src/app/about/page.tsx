import React from 'react'

function page() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-10">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-primary mb-4">
          About Our Project
        </h2>
        <p className="text-lg text-muted-foreground mb-12">
          Meet the minds behind the Solar Panel Recommendation System
        </p>

        {/* Project Guide */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-primary mb-6">
            Project Founder
          </h3>
          <div className="flex justify-center">
            <div className="bg-zinc-900 p-6 rounded-xl shadow-lg w-72">
              <img
                src="ashutosh.png"
                alt="ashutosh salunkhe"
                className="rounded-full h-32 w-32 object-cover mx-auto mb-4 border-4 border-primary"
              />
              <h4 className="text-xl font-semibold text-white">
                Ashutosh Narendra Salunkhe
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Electrical Engineer And Full Stack Web Developer
              </p>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  );
}

export default page