const mysql = require('mysql2/promise');
const dbconfig = require('../config/database.js');
const pool = mysql.createPool(dbconfig);

exports.createUser = async ({ email, nickname, profile_photo, sign_up_date = new Date() } = {}) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [
        rows
      ] = await connection.query(
        'INSERT INTO users(email, nickname, profile_photo, sign_up_date) values (?, ?, ?, ?)',
        [email, nickname, profile_photo, sign_up_date]
      );
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.emailReduplicateValidation = async ({ email }) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query(`SELECT * FROM users WHERE email=(?)`, [email]);
      connection.release();
      return rows[0];
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.nicknameReduplicateValidation = async ({ nickname }) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query(`SELECT * FROM users WHERE nickname=(?)`, [nickname]);
      connection.release();
      return rows[0];
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};

exports.getUserPrimarykey = async nickname => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('SELECT idusers FROM users WHERE nickname=(?)', [
        nickname
      ]);
      connection.release();
      return rows[0];
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};
