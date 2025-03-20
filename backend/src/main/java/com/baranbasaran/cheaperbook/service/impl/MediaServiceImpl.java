package com.baranbasaran.cheaperbook.service.impl;

import com.baranbasaran.cheaperbook.service.MediaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.core.sync.RequestBody;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
public class MediaServiceImpl implements MediaService {

    private final S3Client s3Client;
    private final String bucketName;

    public MediaServiceImpl(
            @Value("${aws.s3.bucket.name}") String bucketName,
            @Value("${aws.region}") String region,
            @Value("${aws.access.key}") String accessKey,
            @Value("${aws.secret.key}") String secretKey
    ) {
        this.bucketName = bucketName;
        log.debug("Initializing S3 client with bucket: {}, region: {}", bucketName, region);

        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKey, secretKey);
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
        
        log.debug("S3 client initialized successfully");
    }

    @Override
    public String uploadFile(MultipartFile file) {
        log.info("Uploading file: {}", file.getOriginalFilename());
        log.debug("File details - size: {} bytes, content type: {}", 
            file.getSize(), file.getContentType());

        String fileName = generateFileName(file.getOriginalFilename());
        log.debug("Generated unique filename: {}", fileName);

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();
            
            log.debug("Uploading file to S3 - bucket: {}, key: {}", bucketName, fileName);
            s3Client.putObject(putObjectRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            String fileUrl = getFileUrl(fileName);
            log.info("File uploaded successfully - URL: {}", fileUrl);
            return fileUrl;

        } catch (S3Exception e) {
            log.error("S3 error while uploading file: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Error uploading file to S3", e);
        } catch (IOException e) {
            log.error("IO error while reading file: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Error reading file for upload", e);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        log.info("Deleting file with URL: {}", fileUrl);
        
        try {
            String fileName = extractFileNameFromUrl(fileUrl);
            log.debug("Extracted filename from URL: {}", fileName);

            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();

            log.debug("Deleting file from S3 - bucket: {}, key: {}", bucketName, fileName);
            s3Client.deleteObject(deleteObjectRequest);
            log.info("File deleted successfully");

        } catch (S3Exception e) {
            log.error("S3 error while deleting file: {}", fileUrl, e);
            throw new RuntimeException("Error deleting file from S3", e);
        }
    }

    @Override
    public String getFileUrl(String fileName) {
        log.debug("Generating URL for file: {}", fileName);
        String url = String.format("https://%s.s3.amazonaws.com/%s", bucketName, fileName);
        log.debug("Generated URL: {}", url);
        return url;
    }

    private String generateFileName(String originalFileName) {
        log.debug("Generating unique filename for: {}", originalFileName);
        String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
        log.debug("Generated filename: {}", uniqueFileName);
        return uniqueFileName;
    }

    private String extractFileNameFromUrl(String fileUrl) {
        log.debug("Extracting filename from URL: {}", fileUrl);
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        log.debug("Extracted filename: {}", fileName);
        return fileName;
    }
} 