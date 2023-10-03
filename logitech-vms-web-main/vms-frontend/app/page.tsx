import Feed from "@components/Feed";

const App = () => {
  return  (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover & share
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center">
          Testing 1234
        </span>
      </h1>
      <p className="desc text-center"> hello world</p>
      <div className="flex flex-col">
  <div className="form-control w-52">
    <label className="cursor-pointer label">
      <span className="label-text">Remember me</span> 
      <input type="checkbox" className="toggle toggle-primary" checked />
    </label>
  </div>
  <div className="form-control w-52">
    <label className="cursor-pointer label">
      <span className="label-text">Remember me</span> 
      <input type="checkbox" className="toggle toggle-secondary" checked />
    </label>
  </div>
  <div className="form-control w-52">
    <label className="cursor-pointer label">
      <span className="label-text">Remember me</span> 
      <input type="checkbox" className="toggle toggle-accent" checked />
    </label>
  </div>
</div>
      <Feed />
    </section>
  )
}

export default App;