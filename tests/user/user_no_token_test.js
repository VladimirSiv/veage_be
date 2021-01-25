process.env.NODE_ENV = "test";

let faker = require("faker");
const db = require("../../models");
let User = db.User;

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
let should = chai.should();

chai.use(chaiHttp);

describe("Users - No Token", () => {
  describe("/GET users", () => {
    it("GET users, should fail ", (done) => {
      chai
        .request(server)
        .get("/users")
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property("message");
          res.body.message.should.eql("No token provided!");
          done();
        });
    });
  });
  describe("/POST user", () => {
    it("POST user, should fail ", (done) => {
      const user_new = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        roleId: 1,
        teamId: 1,
        lastSeen: new Date(),
      };
      chai
        .request(server)
        .post("/users")
        .send(user_new)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property("message");
          res.body.message.should.eql("No token provided!");
          done();
        });
    });
  });
  describe("/PUT user", () => {
    it("PUT user, should fail ", (done) => {
      User.findOne().then((user) => {
        let user_new = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          roleId: 1,
          teamId: 1,
          lastSeen: new Date(),
        };
        chai
          .request(server)
          .put("/users/" + user.dataValues.id)
          .send(user_new)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property("message");
            res.body.message.should.eql("No token provided!");
            done();
          });
      });
    });
  });
  describe("/DELETE user", () => {
    it("DELETE user, should fail ", (done) => {
      User.findOne().then((user) => {
        chai
          .request(server)
          .delete("/users/" + user.id)
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
