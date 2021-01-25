process.env.NODE_ENV = "test";

let faker = require("faker");
const db = require("../../models");
let Project = db.Project;

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
let should = chai.should();

chai.use(chaiHttp);

const user = { username: "admin", password: "pass" };
let token;

describe("Projects - ADMIN", () => {
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
    it("POST project, should succeed ", (done) => {
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
          res.should.have.status(201);
          res.body.should.have.property("id");
          Project.findByPk(res.body.id).then((project) => {
            project.dataValues.id.should.be.eql(res.body.id);
            project.dataValues.name.should.be.eql(project.name);
            project.dataValues.description.should.be.eql(project.description);
            done();
          });
        });
    });
  });

  describe("/PUT project", () => {
    it("PUT project, should succeed ", (done) => {
      Project.findOne().then((project) => {
        let project_new = {
          name: faker.lorem.word(),
          description: faker.lorem.words(),
        };
        chai
          .request(server)
          .put("/projects/" + project.dataValues.id)
          .set({ Authorization: `Bearer ${token}` })
          .send(project_new)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("id");
            Project.findByPk(res.body.id).then((project) => {
              project.name.should.be.eql(project_new.name);
              project.description.should.be.eql(project.description);
              done();
            });
          });
      });
    });
  });

  // TODO project delete has STRICT <- TEST THIS
  // describe("/DELETE project", () => {
  //   it("DELETE project, should succeed ", (done) => {
  //     Project.findOne().then((project) => {
  //       chai
  //         .request(server)
  //         .delete("/projects/" + project.id)
  //         .set({ "Authorization": token })
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.have.property("id");
  //           res.body.id.should.be.eql(project.dataValues.id);
  //           done();
  //         });
  //     });
  //   });
  // });
});
