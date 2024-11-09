

create table direcao.user (
	id int(8) auto_increment,
	email varchar(100) NOT NULL,
	avatar varchar(250),
	name varchar(100) NOT NULL,
	primary key (id)
);