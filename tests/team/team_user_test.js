process.env.NODE_ENV = "test";

let faker = require("faker");
const db = require("../../models");
let Team = db.Team;

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
let should = chai.should();

chai.use(chaiHttp);

const user = { username: "user", password: "pass" };
let token;

describe("Teams - USER", () => {
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

  describe("/GET teams", () => {
    it("GET teams, should succeed", (done) => {
      Team.findAll({ raw: true }).then((teams) => {
        chai
          .request(server)
          .get("/teams")
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.length.should.be.eql(teams.length);
            done();
          });
      });
    });
  });

  describe("/GET teams all", () => {
    it("GET teams all, should succeed", (done) => {
      Team.findAll({ raw: true }).then((teams) => {
        chai
          .request(server)
          .get("/teams/all")
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.length.should.be.eql(teams.length);
            done();
          });
      });
    });
  });

  describe("/POST team", () => {
    it("POST team no permissions, should fail ", (done) => {
      let team = {
        name: faker.lorem.word(),
        description: faker.lorem.sentences(),
      };
      chai
        .request(server)
        .post("/teams")
        .set({ Authorization: `Bearer ${token}` })
        .send(team)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property("message");
          res.body.message.should.eql("Requires Admin Role!");
          done();
        });
    });
  });

  // TODO add put team endpoint
  // describe("/PUT team", () => {
  //   it("PUT team no permissions, should fail ", (done) => {
  //     Team.findOne().then((team) => {
  //       let team_new_name = { name: faker.lorem.word() };
  //       chai
  //         .request(server)
  //         .put("/teams/" + team.id)
  //         .set({ "Authorization": token })
  //         .send(team_new_name)
  //         .end((err, res) => {
  //           res.should.have.status(403);
  //           res.body.should.have.property("message");
  //           res.body.message.should.eql("Requires Moderator or Admin Role!");
  //           done();
  //         });
  //     });
  //   });
  // });

  // TODO add detele team endpoint
  // describe("/DELETE team", () => {
  //   it("DELETE team no permissions, should fail ", (done) => {
  //     Team.findOne().then((team) => {
  //       chai
  //         .request(server)
  //         .delete("/teams/" + team.id)
  //         .set({ "Authorization": token })
  //         .end((err, res) => {
  //           res.should.have.status(403);
  //           res.body.should.have.property("message");
  //           res.body.message.should.eql("Requires Admin Role!");
  //           done();
  //         });
  //     });
  //   });
  // });
});
