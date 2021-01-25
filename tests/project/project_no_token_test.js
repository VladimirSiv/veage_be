process.env.NODE_ENV = "test";

let faker = require("faker");
const db = require("../../models");
let Project = db.Project;

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
let should = chai.should();

chai.use(chaiHttp);

describe("Projects - No Token", () => {
  describe("/GET projects", () => {
    it("GET projects, should fail ", (done) => {
      chai
        .request(server)
        .get("/projects")
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property("message");
          res.body.message.should.eql("No token provided!");
          done();
        });
    });
  });
  describe("/POST project", () => {
    it("POST project, should fail ", (done) => {
      const project_new = {
        name: faker.lorem.word(),
        description: faker.lorem.words(),
      };
      chai
        .request(server)
        .post("/projects")
        .send(project_new)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property("message");
          res.body.message.should.eql("No token provided!");
          done();
        });
    });
  });
  describe("/PUT project", () => {
    it("PUT project, should fail ", (done) => {
      Project.findOne().then((project) => {
        let project_new = {
          name: faker.lorem.word(),
          description: faker.lorem.words(),
        };
        chai
          .request(server)
          .put("/projects/" + project.dataValues.id)
          .send(project_new)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property("message");
            res.body.message.should.eql("No token provided!");
            done();
          });
      });
    });
  });
  describe("/DELETE project", () => {
    it("DELETE project, should fail ", (done) => {
      Project.findOne().then((project) => {
        chai
          .request(server)
          .delete("/projects/" + project.id)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property("message");
            res.body.message.should.eql("No token provided!");
            done();
          });
      });
    });
  });
});
