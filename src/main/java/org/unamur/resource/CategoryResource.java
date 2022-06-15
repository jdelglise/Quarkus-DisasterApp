package org.unamur.resource;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.annotation.security.PermitAll;
import javax.inject.Inject;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.Response;

import org.bson.types.ObjectId;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.openapitools.api.CategoryApi;
import org.openapitools.model.CategoryDto;
import org.openapitools.model.CustomFormFieldDto;
import org.unamur.entity.CategoryEntity;
import org.unamur.entity.CustomFormFieldEntity;
import org.unamur.mapper.ICategoryMapper;
import org.unamur.mapper.ICustomFormFieldMapper;
import org.unamur.repository.CategoryRepository;
import org.unamur.repository.UserRepository;

import io.quarkus.mongodb.panache.PanacheQuery;
public class CategoryResource implements CategoryApi {

    @Inject
    ICategoryMapper categoryMapper;

    @Inject
    CategoryRepository categoryRepository;

    @Inject
    ICustomFormFieldMapper customFormFieldMapper;

    @Inject
    UserRepository userRepository;

    @Inject
    JsonWebToken jwt; 

    @PermitAll
    @Override
    public Response getCategories() {
        PanacheQuery<CategoryEntity> categories = categoryRepository.findAll();
        List<CategoryDto> listCategoryResponse = new ArrayList<CategoryDto>();
        for(CategoryEntity category : categories.list()){
            List<CustomFormFieldDto> customFormFieldList = new ArrayList<CustomFormFieldDto>();
            for(CustomFormFieldEntity customFormFieldEntity : category.getCustomFields())
            {
                // map custom fields
                CustomFormFieldDto customFormFieldDto = customFormFieldMapper.toDto(customFormFieldEntity);
                customFormFieldList.add(customFormFieldDto);
            }
            CategoryDto categoryResponse = categoryMapper.toDto(category);
            categoryResponse.setCustomFields(customFormFieldList);
            listCategoryResponse.add(categoryResponse);
        }
        
        return Response.ok(listCategoryResponse).build();
    }    

    @PermitAll
    @Override
    public Response getCategory(String id) {
        // check if the id category is available
        Optional<CategoryEntity> optCategoryEntity = categoryRepository.findByIdOptional(new ObjectId(id));
        if (optCategoryEntity.isEmpty()) {
            throw new NotFoundException(MessageFormat.format("Publication with id {0} not found.", id));
        }
        CategoryEntity categoryEntity = optCategoryEntity.get();        
        CategoryDto categoryResponse = categoryMapper.toDto(categoryEntity);
        
        List<CustomFormFieldDto> customFormFieldList = new ArrayList<CustomFormFieldDto>();
        for(CustomFormFieldEntity customFormFieldEntity : optCategoryEntity.get().getCustomFields())
        {
            // map custom fields
            CustomFormFieldDto customFormFieldDto = customFormFieldMapper.toDto(customFormFieldEntity);
            customFormFieldList.add(customFormFieldDto);
        }
        categoryResponse.setCustomFields(customFormFieldList);

        
        return Response.ok(categoryResponse).build();
    }


    @PermitAll
    @Override
    public Response getCategoriesByType(String type) {
        ArrayList<CategoryEntity> categories = (ArrayList<CategoryEntity>) categoryRepository.findByTypeOptional(type);
        List<CategoryDto> listCategoryResponse = new ArrayList<CategoryDto>();
        for(CategoryEntity category : categories){
            List<CustomFormFieldDto> customFormFieldList = new ArrayList<CustomFormFieldDto>();
            for(CustomFormFieldEntity customFormFieldEntity : category.getCustomFields())
            {
                // map custom fields
                CustomFormFieldDto customFormFieldDto = customFormFieldMapper.toDto(customFormFieldEntity);
                customFormFieldList.add(customFormFieldDto);
            }
            CategoryDto categoryResponse = categoryMapper.toDto(category);
            categoryResponse.setCustomFields(customFormFieldList);
            listCategoryResponse.add(categoryResponse);
        }
        
        return Response.ok(listCategoryResponse).build();
    }    

    public CategoryEntity mapCustomFieldsToEntity(CategoryDto category, CategoryEntity categoryResponse)
    {
        List<CustomFormFieldEntity> customFormFieldList = new ArrayList<CustomFormFieldEntity>();
        for(CustomFormFieldDto customFormFieldDto : category.getCustomFields())
        {             
            CustomFormFieldEntity customFormFieldEntity = customFormFieldMapper.toEntity(customFormFieldDto);
            customFormFieldList.add(customFormFieldEntity);
        }
        categoryResponse.setCustomFields(customFormFieldList);
        return categoryResponse;
    }
}