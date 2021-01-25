process.env.NODE_ENV = "test";

let faker = require("faker");
const db = require("../../models");
let Project = db.Project;

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
let should = chai.should();

chai.use(chaiHttp);

const user = { username: "user", password: "pass" };
let token;

describe("Projects - USER", () => {
  before((done) => {
    chai
      .request(server)
      .post("/signin")
      .send(user)
      .end((err, res) => {
        token = res.body.access_token;
        done();
      });
  });

  describe("/GET projects", () => {
    it("GET projects, should succeed", (done) => {
      Project.findAll({ raw: true }).then((projects) => {
        chai
          .request(server)
          .get("/projects")
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.length.should.be.eql(projects.length);
            done();
          });
      });
    });
  });

  describe("/POST project", () => {
    it("POST project no permissions, should fail ", (done) => {
      let project = {
        name: faker.lorem.word(),
        description: faker.lorem.sentences(),
      };
      chai
        .request(server)
        .post("/projects")
        .set({ Authorization: `Bearer ${token}` })
        .send(project)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property("message");
          res.body.message.should.eql("Requires Admin Role!");
          done();
        });
    });
  });

  describe("/PUT project", () => {
    it("PUT project no permissions, should fail ", (done) => {
      Project.findOne().then((project) => {
        let project_new_name = { name: faker.lorem.word() };
        chai
          .request(server)
          .put("/projects/" + project.id)
          .set({ Authorization: `Bearer ${token}` })
          .send(project_new_name)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property("message");
            res.body.message.should.eql("Requires Moderator or Admin Role!");
            done();
          });
      });
    });
  });

  describe("/DELETE project", () => {
    it("DELETE project no permissions, should fail ", (done) => {
      Project.findOne().then((project) => {
        chai
          .request(server)
          .delete("/projects/" + project.id)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property("message");
            res.body.message.should.eql("Requires Admin Role!");
            done();
          });
      });
    });
  });
});
