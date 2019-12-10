package com.blog.mapper;

import org.apache.ibatis.annotations.*;

public interface MarkdownMapper {

    @Select("SELECT context FROM markdowns WHERE uuid=#{uuid}")
    String getMarkdown(@Param("uuid") String uuid);

    @Insert("INSERT INTO markdowns(uuid,context) VALUES(#{uuid},#{context})")
    void addMarkdown(@Param("uuid") String uuid,@Param("context") String context);

    @Update("UPDATE markdowns SET context=#{context} WHERE uuid=#{uuid}")
    void editMarkdown(@Param("uuid") String uuid,@Param("context") String context);

    @Delete("DELETE FROM markdowns WHERE uuid=#{uuid}")
    void deleteMarkdown(@Param("uuid") String uuid);
}
