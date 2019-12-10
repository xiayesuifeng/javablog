package com.blog.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "markdowns")
public class Markdown {
    @Id
    @Column(length = 128)
    private String uuid;

    @Column(columnDefinition = "text")
    private String context;
}
