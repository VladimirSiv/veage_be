process.env.NODE_ENV = "test";

let faker = require("faker");
const db = require("../../models");
let Team = db.Team;

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
let should = chai.should();

chai.use(chaiHttp);

describe("Teams - No Token", () => {
  describe("/GET teams", () => {
    it("GET teams, should fail ", (done) => {
      chai
        .request(server)
        .get("/teams")
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property("message");
          res.body.message.should.eql("No token provided!");
          done();
        });
    });
  });

  describe("/GET teams all", () => {
    it("GET teams, should fail ", (done) => {
      chai
        .request(server)
        .get("/teams/all")
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property("message");
          res.body.message.should.eql("No token provided!");
          done();
        });
    });
  });

  describe("/POST team", () => {
    it("POST team, should fail ", (done) => {
      const team_new = {
        name: faker.lorem.word(),
        description: faker.lorem.words(),
      };
      chai
        .request(server)
        .post("/teams")
        .send(team_new)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property("message");
          res.body.message.should.eql("No token provided!");
          done();
        });
    });
  });

  // TODO create put team endpoint
  // describe("/PUT team", () => {
  //   it("PUT team, should fail ", (done) => {
  //     team.findOne().then((team) => {
  //       let team_new = {
  //         name: faker.lorem.word(),
  //         description: faker.lorem.words(),
  //       };
  //       chai
  //         .request(server)
  //         .put("/teams/" + team.id)
  //         .send(team_new)
  //         .end((err, res) => {
  //           res.should.have.status(403);
  //           res.body.should.have.property("message");
  //           res.body.message.should.eql("No token provided!");
  //           done();
  //         });
  //     });
  //   });
  // });

  // TODO create delete team endpoint
  // describe("/DELETE team", () => {
  //   it("DELETE team, should fail ", (done) => {
  //     Team.findOne().then((team) => {
  //       chai
  //         .request(server)
  //         .delete("/teams/" + team.id)
  //         .end((err, res) => {
  //           res.should.have.status(403);
  //           res.body.should.have.property("message");
  //           res.body.message.should.eql("No token provided!");
  //           done();
  //         });
  //     });
  //   });
  // });
});
