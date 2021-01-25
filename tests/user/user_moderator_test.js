process.env.NODE_ENV = "test";

let faker = require("faker");
const db = require("../../models");
let User = db.User;

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../server");
const { assert } = require("chai");
let should = chai.should();

chai.use(chaiHttp);

const user = { username: "moderator", password: "pass" };
let token;

describe("Users - MODERATOR", () => {
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

  describe("/GET users", () => {
    it("GET users, should succeed", (done) => {
      User.findOne({ raw: true }).then((user) => {
        chai
          .request(server)
          .get("/users/" + user.id)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.id.should.eql(user.id);
            res.body.username.should.eql(user.username);
            assert.deepEqual(
              new Date(res.body.lastSeen),
              new Date(user.lastSeen)
            );
            res.body.should.have.property("UserDetail");
            res.body.should.have.property("Role");
            done();
          });
      });
    });
  });

  describe("/POST user", () => {
    it("POST user no permissions, should fail ", (done) => {
      const user = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        roleId: 1,
        teamId: 1,
        lastSeen: new Date(),
      };
      chai
        .request(server)
        .post("/users")
        .set({ Authorization: `Bearer ${token}` })
        .send(user)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property("message");
          res.body.message.should.eql("Requires Admin Role!");
          done();
        });
    });
  });

  describe("/PUT user", () => {
    it("PUT user no permissions, should fail ", (done) => {
      User.findOne().then((user) => {
        const user_new = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          roleId: 1,
          teamId: 1,
          lastSeen: new Date(),
        };
        chai
          .request(server)
          .put("/users/" + user.id)
          .set({ Authorization: `Bearer ${token}` })
          .send(user_new)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property("message");
            res.body.message.should.eql("Requires Admin Role!");
            done();
          });
      });
    });
  });

  describe("/DELETE user", () => {
    it("DELETE user no permissions, should fail ", (done) => {
      User.findOne().then((user) => {
        chai
          .request(server)
          .delete("/users/" + user.id)
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
