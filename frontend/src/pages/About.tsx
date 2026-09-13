import Navbar from "../components/Navbar";

const About = () => {
  return (
    <>
      <Navbar isLogged={false} />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          About To Do List
        </h1>

        <p className="text-lg leading-8 text-gray-600">
          To Do List is a simple, no-frills task management app built to help
          you stay organized without the clutter. Whether you're planning your
          day, tracking a project, or just trying to remember what needs to get
          done, To Do List gives you everything you need—and nothing you don't.
          <br />
          <br />
          Add new tasks in seconds, update them as your plans change, and delete
          what's no longer relevant, all through a clean and intuitive
          interface. Built with simplicity in mind, To Do List focuses on doing
          one thing well: helping you keep track of your to-dos, so you can
          focus on getting things done.
        </p>
      </div>
    </>
  );
};

export default About;
