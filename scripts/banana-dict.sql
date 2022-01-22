drop table if exists dicts;

-- dicts
CREATE TABLE dicts (
    dictid INTEGER primary key autoincrement,
    name text NOT NULL unique, 
    description text,
    selected boolean NOT NULL
);

INSERT INTO dicts (name, description, selected) 
VALUES
    (
        "NASPA Word List (2020)",
        "The official word reference for SCRABBLE played in the United States and Canada",
        true
    ),
    (
        "NASPA School Word List (2020)",
        "The official word list used in School SCRABBLE competitions",
        true
    )
;

-- words
drop table if exists words;

create table words (
    word text not null,
    word_friendly text,
    definition_friendly text,
    pos_friendly text,
    dictid integer,
    FOREIGN KEY(dictid) REFERENCES dicts(dictid)
);

