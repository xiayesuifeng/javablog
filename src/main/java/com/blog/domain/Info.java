package com.blog.domain;

public class Info {
    private String logo;
    private boolean useCategory;
    private String name;
    private transient int categoryId;

    private static Info instance;

    private Info() {

    }

    public static Info getInstance() {
        if (instance == null)
            instance = new Info();

        return instance;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public boolean getUseCategory() {
        return useCategory;
    }

    public void setUseCategory(boolean useCategory) {
        this.useCategory = useCategory;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }
}
