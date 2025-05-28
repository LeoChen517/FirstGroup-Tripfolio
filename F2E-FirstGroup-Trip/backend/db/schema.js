const { pgTable, serial, varchar, char, integer, text } = require('drizzle-orm/pg-core');
import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const members = pgTable('members', {
    email: varchar('email', { length: 255 }).notNull().primaryKey(),
    password: varchar('password', { length: 255 }).notNull(), // bcrypt 加密後的密碼是 60 字元左右
    phone: varchar('phone', { length: 20 }).notNull(),
})

module.exports = {

};