-- MySQL Script generated by MySQL Workbench
-- qua 02 set 2020 13:06:22 -03
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema futiba
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema futiba
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `futiba` DEFAULT CHARACTER SET utf8 ;
USE `futiba` ;

-- -----------------------------------------------------
-- Table `futiba`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `futiba`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(245) NULL,
  `email` VARCHAR(245) NULL,
  `passwd` VARCHAR(245) NULL,
  `role` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `futiba`.`grupos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `futiba`.`grupos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `futiba`.`grupos_users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `futiba`.`grupos_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `group_id` INT NOT NULL,
  `role` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_grupos_users_users_idx` (`user_id` ASC),
  INDEX `fk_grupos_users_grupos1_idx` (`group_id` ASC),
  CONSTRAINT `fk_grupos_users_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `futiba`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_grupos_users_grupos1`
    FOREIGN KEY (`group_id`)
    REFERENCES `futiba`.`grupos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `futiba`.`games`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `futiba`.`games` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `team_a` VARCHAR(45) NULL,
  `team_b` VARCHAR(45) NULL,
  `result_a` INT NULL,
  `result_b` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `futiba`.`guessings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `futiba`.`guessings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `result_a` INT NULL,
  `result_b` INT NULL,
  `score` INT NULL,
  `game_id` INT NOT NULL,
  `group_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_guessings_games1_idx` (`game_id` ASC),
  INDEX `fk_guessings_grupos1_idx` (`group_id` ASC),
  INDEX `fk_guessings_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_guessings_games1`
    FOREIGN KEY (`game_id`)
    REFERENCES `futiba`.`games` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_guessings_grupos1`
    FOREIGN KEY (`group_id`)
    REFERENCES `futiba`.`grupos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_guessings_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `futiba`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `futiba`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `futiba`.`comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `comment` TEXT NULL,
  `guessing_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_comments_guessings1_idx` (`guessing_id` ASC),
  INDEX `fk_comments_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_comments_guessings1`
    FOREIGN KEY (`guessing_id`)
    REFERENCES `futiba`.`guessings` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_comments_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `futiba`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
