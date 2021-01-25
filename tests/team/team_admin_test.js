process.env.NODE_ENV = "test";

let faker = require("faker");
const db = require("../../models");
let Team = db.Team;

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
let should = chai.should();

chai.use(chaiHttp);

const user = { username: "admin", password: "pass" };
let token;

describe("Teams - ADMIN", () => {
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

  describe("/GET teams all ", () => {
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
    it("POST team, should succeed ", (done) => {
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
          res.should.have.status(201);
          res.body.should.have.property("id");
          Team.findByPk(res.body.id).then((team) => {
            team.id.should.be.eql(res.body.id);
            team.name.should.be.eql(team.name);
            team.description.should.be.eql(team.description);
            done();
          });
        });
    });
  });

  // TODO add put team endpoint
  // describe("/PUT team", () => {
  //   it("PUT team, should succeed ", (done) => {
  //     team.findOne().then((team) => {
  //       let team_new = {
  //         name: faker.lorem.word(),
  //         description: faker.lorem.words(),
  //       };
  //       chai
  //         .request(server)
  //         .put("/teams/" + team.dataValues.id)
  //         .set({ "Authorization": token })
  //         .send(team_new)
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.have.property("id");
  //           team.findByPk(res.body.id).then((team) => {
  //             team.name.should.be.eql(team_new.name);
  //             team.description.should.be.eql(team.description);
  //             done();
  //           });
  //         });
  //     });
  //   });
  // });

  // TODO team delete has STRICT <- TEST THIS
  // describe("/DELETE team", () => {
  //   it("DELETE team, should succeed ", (done) => {
  //     team.findOne().then((team) => {
  //       chai
  //         .request(server)
  //         .delete("/teams/" + team.id)
  //         .set({ "Authorization": token })
  //         .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.have.property("id");
  //           res.body.id.should.be.eql(team.dataValues.id);
  //           done();
  //         });
  //     });
  //   });
  // });
});
