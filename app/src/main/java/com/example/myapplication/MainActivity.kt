package com.example.myapplication

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat.checkSelfPermission
import com.example.myapplication.ui.theme.MyApplicationTheme
import com.kakaomobility.knsdk.KNLanguageType

class MainActivity : AppCompatActivity(), View.OnClickListener {

    lateinit var btnGuide: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        btnGuide = findViewById(R.id.btn_guide)
        btnGuide.setOnClickListener(this)
    }

    /**
     * 버튼 클릭 이벤트
     */
    override fun onClick(v: View?) {
        checkPermission()
    }


    /**
     * GPS 위치 권한을 확인합니다.
     */
    fun checkPermission() {
        when {
            checkSelfPermission(
                Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED -> {
                gpsPermissionCheck()
            }

            else -> {
              knsdkAuth()
            }
        }
    }

    /**
     * GPS 위치 권한을 요청합니다.
     */
    fun gpsPermissionCheck() {
        ActivityCompat.requestPermissions(
            this,
            arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
            1234)
    }

    /**
     * GPS 위치 권한 요청의 실패 여부를 확인합니다.
     */
    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        when (requestCode) {
            1234 -> {
                if (grantResults.isNotEmpty() &&
                    grantResults[0] == PackageManager.PERMISSION_GRANTED) {

                    // 다시 권한 요청하는 곳으로 돌아갑니다.
                    checkPermission()
                }
            }
        }
    }
    /**
     * 길찾기 SDK 인증을 진행합니다.
     */
    fun knsdkAuth() {
        KNApplication.knsdk.apply {
            initializeWithAppKey(
                aAppKey = "573a700f121bff5d3ea3960ff32de487",       // 카카오디벨로퍼스에서 부여 받은 앱 키
                aClientVersion = "1.0",                                               // 현재 앱의 클라이언트 버전
                aUserKey = "testUser",                                                  // 사용자 id
                aLangType = KNLanguageType.KNLanguageType_KOREAN,   // 언어 타입
                aCompletion = {

                    // Toast는 UI를 갱신하는 작업이기 때문에 UIThread에서 동작되도록 해야 합니다.
                    runOnUiThread {
                        if (it != null) {
                            Toast.makeText(applicationContext, "인증에 실패하였습니다", Toast.LENGTH_LONG).show()

                        } else {
                            Toast.makeText(applicationContext, "인증 성공하였습니다", Toast.LENGTH_LONG).show()

                            var intent = Intent(this@MainActivity, NaviActivity::class.java)
                            this@MainActivity.startActivity(intent)
                        }
                    }
                })
        }
    }



}

